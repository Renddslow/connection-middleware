const getConnectionSettings = require('./getConnectionSettings');

const scriptTemplate = (connectionObj) => `
<script>
  function getConnectionStatus(ms) {
      if (ms >= 2000) return 'slow-2g';
      if (ms >= 1400) return '2g';
      if (ms >= 270) return '3g';
      return '4g';
  }
  
  const connections = JSON.parse(${connectionObj});

  (function() {
    window.serverConnection = {};
    const serverTimeMeta = document.querySelector('meta[name="server-connection-time"]');

    if (!serverTimeMeta || !serverTimeMeta.content) {
      console.error('No server connection time was returned');
    }

    const browserTime = new Date().getTime();
    const serverTime = parseInt(serverTimeMeta.content, 10);

    const ect = getConnectionStatus(serverTime - browserTime);
    window.serverConnection = connections[ect];
    
  })();
</script>
`;

const addToContent = (original, content) => {
  const lines = original.split('\n').filter((l) => l.trim());
  lines.push(content);
  return lines.join('\n');
};

module.exports = function(html, opts = {}) {
  const headRegexpr = /<head>([\d\D]+)<\/head>/g;
  const headMatch = headRegexpr.exec(html);

  const bodyRegexpr = /<body>([\d\D]+)<\/body>/g;
  const bodyMatch = bodyRegexpr.exec(html);

  if (!headMatch && !headMatch[1]) {
    throw new Error('HTML did not include a valid document head.');
  }

  const headInner = addToContent(
    headMatch[1],
    `<meta name="server-connection-time" value="${new Date().getTime()}">`,
  );

  const head = `<head>\n${headInner}\n</head>`;
  const replacedHead = html.replace(headRegexpr, head);

  if (!bodyMatch && !bodyMatch[1]) {
    throw new Error('HTML did not include a valid document body');
  }

  const connectionObj = getConnectionSettings(opts);
  const bodyInner = addToContent(bodyMatch[1], scriptTemplate(JSON.stringify(connectionObj)));

  const body = `<body>\n${bodyInner}\n</body>`;
  return replacedHead.replace(bodyRegexpr, body);
};
