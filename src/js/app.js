async function loadPhotos() {
    const response = await fetch("./photos.json");
    const photos   = await response.json();
    const data     = photos.photos

    function allPhotos(photos) {
        const gallery     = document.querySelector('#gallery')
        gallery.innerHTML = ''
    
        photos.map(photo => {
            gallery.innerHTML += `<div class="column-4">
                    <div class="card">
                        <div class="imagen">
                            <img src="dist/img/${photo.name}" alt="${photo.name}" class="image-full image-gallery">
                        </div>
                        <div class="hover">
                            <p>creative logo</p>
                            <h4>${photo.category_name}</h4>
                        </div>
                    </div>
                </div>`
        })
    }

    allPhotos(data);
    
    const a = document.getElementsByClassName('filter');
    Array.from(a).forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();
            let idCategory = Number(e.target.getAttribute('data-id'))
            
            if(idCategory === 0) {
                allPhotos(data);
            } else {
                const filterData = data.filter(p => p.category === idCategory)
                console.log(filterData)
                allPhotos(filterData);
            }
        });
    })
}

loadPhotos();