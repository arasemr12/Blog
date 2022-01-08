let imginp = document.getElementById('imginp');
let img = document.getElementById('img')

imginp.onchange = (e) => {
    const [file] = imginp.files
    if (file) {
        img.src = URL.createObjectURL(file);
    }
}