import blobStream from 'blob-stream';

export const waitForData = async doc => {
  return new Promise((resolve, reject) => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfBase64 = pdfBuffer.toString('base64');
      
      // Create a blob stream and download the PDF
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const stream = blobStream();
      stream.on('finish', function() {
        const url = stream.toBlobURL('application/pdf');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.pdf';
        a.click();
      });

      // Convert Blob to ArrayBuffer and then to Uint8Array
      const reader = new FileReader();
      reader.onload = function() {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        stream.end(uint8Array);
      };
      reader.readAsArrayBuffer(blob);

      resolve(`data:application/pdf;base64,${pdfBase64}`);
    });
    doc.on('error', reject);
  });
};
