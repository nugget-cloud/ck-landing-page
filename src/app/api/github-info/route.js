import { NextResponse } from 'next/server';

async function fetchRepoData(owner, repo) {
  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const topicsUrl = `https://api.github.com/repos/${owner}/${repo}/topics`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, topicsRes] = await Promise.all([
      fetch(repoUrl, { headers }),
      fetch(topicsUrl, { headers }),
    ]);

    if (!repoRes.ok) {
      return { error: `Failed to fetch repository data: ${repoRes.statusText}` };
    }

    const repoData = await repoRes.json();
    const topicsData = topicsRes.ok ? await topicsRes.json() : { names: [] };

    return {
      title: repoData.name,
      author: repoData.owner.login,
      description: repoData.description || 'No description provided.',
      tags: topicsData.names || [],
      stars: repoData.stargazers_count,
      language: repoData.language,
      link: repoData.html_url,
    };
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching repository data.' };
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'GitHub repository URL is required.' }, { status: 400 });
    }

    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL.' }, { status: 400 });
    }

    const [, owner, repo] = match;
    const data = await fetchRepoData(owner, repo.replace('.git', ''));

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
