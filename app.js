let pagina = 1
let animes = ''
let description = ''
UltimoElemento = ''

const observador = new IntersectionObserver((entrada, observador) => {
    /* console.log(entrada) */
    entrada.forEach(obs => {
        if(obs.isIntersecting === true){
            pagina ++
            getAnime()
        }
    })
},{
    rootMargin: '0px 0px 200px 0px',
    threshold: 1.0
})
const getAnime = async() => {
    try{
        const resultado = await fetch(`https://api.jikan.moe/v4/top/anime?page=${pagina}`)

        /* console.log(resultado) */

        const info = await resultado.json()

        /* console.log(info) */

        info.data.forEach(element => {

            //genera colores randoms basado en un arreglo de 6 posiciones
            const color = ['#9fe2d7', '#02c2b3', '#c4368b', '#56c3ec', '#79e903', '#e21f2d']
            const colorRandom = color[ 0 + Math.floor(Math.random() * 5)]

            /* const r = Math.floor(Math.random() * 256)
            const g = Math.floor(Math.random() * 256)
            const b = Math.floor(Math.random() * 256) */

            /* const colorRandom = `rgb(${r},${g},${b})` */

            animes += `
                <div class="animes">
                    <div class="poster" style="background-color:${colorRandom}">
                        <img src="${element.images.jpg.image_url}">
                        <div class="tit_studi">
                            <div class="titulo">${element.title}</div>
                            <div class="studio" style="color:${colorRandom}">${element.studios[0].name}</div>
                        </div>
                    </div>
                    <div class="info-anime" onmouseout="scrolltop()">
                        <div class="popularity">
                            <span class="rank">#${element.rank}</span>
                            <span class="score">Score: ${element.score}</span>
                        </div>
                        <div class="description">${element.synopsis}</div>
                        <div class="generos">`
                    element.genres.slice(0, 2).forEach(genre => {
                        animes += `<span style="background-color:${colorRandom}">${genre.name}</span>`
                    })
                animes +=  
                        `</div>
                    </div>
                </div>
            `
            })

        //verifica el numero de la paginna sea igual o inferior al total de resultados paginados
        if(pagina<=info.pagination.last_visible_page){

            //borra el registro del elemento anterior que fue observado (metodo de optimizacion)
            if(UltimoElemento){
                observador.unobserve(UltimoElemento)
            }

            //guarda el resultados de la API en la clase CAJA
            document.querySelector('.caja').innerHTML = animes

            //accede al ultimo elemento proveniente del resultado de la primera pagina
            const elementos = document.querySelectorAll('.animes')
            UltimoElemento = elementos[elementos.length - 1];

            //guarda el ultimo elemento en el observador
            observador.observe(UltimoElemento)

            //calcula el alto dado por el atributo genero y si su altura es mayor a 20px reduce el tamaño de la fuenta a 10px y el padding en el eje X
            const height = document.querySelectorAll('.generos span')
            height.forEach(hght =>{
                if(hght.offsetHeight>20){
                    hght.style.fontSize = '10px'
                    hght.style.paddingLeft ='7px'
                    hght.style.paddingRight ='7px'
                }
            })

        }

    } catch(errors){
        console.log(errors)
    }
}

//hace que la posicion del scroll en el apartado de la sipnosis vuelva a 0 cuando el mouse sale del elemento
const scrolltop = () => {
    document.querySelectorAll('.info-anime').forEach(scroll => {
        scroll.querySelector('.description').scrollTo({
        top: 0,
        behavior: 'smooth',
        });
    });
}

//muestra los resultados de la API
getAnime()