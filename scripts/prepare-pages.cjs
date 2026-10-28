const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  // 1. Ensure .nojekyll exists so GitHub Pages does not ignore underscore assets
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  const indexPath = path.join(distDir, 'index.html');
  const notFoundPath = path.join(distDir, '404.html');

  if (fs.existsSync(indexPath)) {
    // 2. Generate intelligent 404.html SPA router for GitHub Pages & static hosting
    // Preserves deep link paths and queries, redirecting seamlessly into index.html
    const spa404Content = `<!DOCTYPE html>
<html lang="en" style="background-color: #0b0f19; color: #f8fafc;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0b0f19" />
    <title>SchoolLink - Redirecting...</title>
    <script>
      // Single Page App Deep Link Handler for GitHub Pages & Static Hosting
      (function() {
        var l = window.location;
        var pathSegments = l.pathname.split('/').filter(Boolean);
        // Identify if hosted on GitHub Pages user repo (e.g., https://username.github.io/repo-name/)
        var isGithubProject = l.hostname.endsWith('github.io') && pathSegments.length > 0;
        var repoSegment = isGithubProject ? '/' + pathSegments[0] : '';
        var deepPath = l.pathname.slice(repoSegment.length);

        var destination = l.protocol + '//' + l.host + repoSegment + '/?p=' +
          encodeURIComponent(deepPath || '/') +
          (l.search ? '&q=' + encodeURIComponent(l.search.slice(1)) : '') +
          l.hash;

        l.replace(destination);
      })();
    </script>
  </head>
  <body style="background-color: #0b0f19; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 24px;">
    <div style="width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #059669, #0d9488); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.4);">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    </div>
    <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 6px 0; font-weight: 700;">SchoolLink</h2>
    <p style="font-size: 13px; color: #94a3b8; margin: 0;">Restoring deep link route...</p>
  </body>
</html>
`;
    fs.writeFileSync(notFoundPath, spa404Content, 'utf8');
    console.log('GitHub Pages post-build: Successfully created dist/.nojekyll and SPA 404.html');
  }
}
