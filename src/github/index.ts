import * as vscode from 'vscode';
import axios from 'axios';
import { renderPage, renderMsg } from './template';

export async function getReadmeFile(keyword: string) {
  // search github repo
  const res = await axios({
      url: 'https://api.github.com/search/repositories',
      params: {
          q: keyword,
      },
      headers: {
          'Accept': 'application/vnd.github.json',
          'X-GitHub-Api-Version': '2022-11-28',
      }
  });
  const items = res.data.items;
  if (items.length === 0) {
      return;
  }
  const repo = items[0];
  // get readme file
  const readmeRes = await axios({
      url: `https://api.github.com/repos/${repo.full_name}/readme`,
      headers: {
          'Accept': 'application/vnd.github.html',
          'X-GitHub-Api-Version': '2022-11-28',
      }
  });
  const readme = readmeRes.data;
  return readme;
}

export async function showGithubReadme(webview: vscode.Webview, keyword: string) {
  webview.html = renderMsg('Loading...')
  try {
    const readme = await getReadmeFile(keyword);
    if (!readme) {
      webview.html = renderMsg('Not found')
      return;
    }
    webview.html = renderPage(readme);
  } catch (error) {
    webview.html = renderMsg('Request github.com error')
  }
}