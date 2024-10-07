import { useEffect } from "react";

function sseevent(message: string) {
    let type = 'message', start = 0;
    if (message.startsWith('event: ')) {
        start = message.indexOf('\n');
        type = message.slice(7, start);
    }
    start = message.indexOf(': ', start) + 2;
    let data = message.slice(start, message.length);

    return new MessageEvent(type, { data: data })
}

async function sendMessage() {
    var message = "38.695074,-121.227314"
    var response = await fetch('http://localhost:8000/stream/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
    });

    var reader = response.body?.getReader();
    if (!reader) return

    var decoder = new TextDecoder('utf-8');

    reader.read().then(function processResult(result): any {
        if (result.done) return;
        const token = decoder.decode(result.value);
        console.log(token);
        const event = sseevent(token);
        console.log(event);
        return reader?.read().then(processResult);
    });

}
sendMessage();

function Chat() {


    useEffect(() => {
    }, []);

    return (
        <div>
            <h1>Chat</h1>
        </div>
    );
}

export default Chat;