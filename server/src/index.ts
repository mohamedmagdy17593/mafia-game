import server from './sever';

import './io';

const PORT = process.env.PORT || 4000;

async function init() {
  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });
}

init();
