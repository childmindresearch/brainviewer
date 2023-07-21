export async function spectrogram(callback: (data: Uint8Array) => void) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 1024;

    setInterval(() => {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        callback(dataArray);
    }, 100);
}