function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Copied to clipboard');       
    }, function(err) {        
    });
}

const copyButton = document.getElementById('copy-button');
if (copyButton) {
    copyButton.addEventListener('click', function() {
        const textToCopy = document.getElementById('text-element').innerText;
        copyToClipboard(textToCopy);
    });
}