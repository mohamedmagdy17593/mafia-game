/** @jsxImportSource @emotion/react */

import { Button } from 'primereact/button';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import socket from './utils/socket';

function App() {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    socket.on('welcome', (message: string) => {
      toast.current?.show({ severity: 'info', detail: message, life: 3000 });
    });
  }, []);

  function handleSendMessage() {
    socket.emit('message', 'Hello from the client');
  }

  return (
    <div className="App">
      <Toast ref={toast} />
      <Button label="Send Message" onClick={handleSendMessage} />
    </div>
  );
}

export default App;
