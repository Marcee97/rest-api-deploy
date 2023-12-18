const express = require('express')
const crypto = require('node:crypto')
const movies = require('./Movies.json')
const { validarPelicula, validarPartialsMovie } = require('./validesquema/validacion')


const app = express()
app.use(express.json())

app.disable('x-powered-by')

app.get('/movies', (req,res) =>{
    res.header('Access-Control-Allow-Origin', '*')
    const { genre } = req.query
    if (genre) {
        const filtroGenero = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )

        return res.json(filtroGenero)
    }
    res.json(movies)
})


app.post('/movies',(req,res)=>{
    const result = validarPelicula(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message)})
    }


const nuevaPelicula = {
    id: crypto.randomUUID(),
   ...result.data
}


movies.push(nuevaPelicula)
res.status(201).json(nuevaPelicula)
})

app.patch('/movies/:id', (req, res) =>{
    const result = validarPartialsMovie(req.body)
    
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex == -1){
        return res.status(404).json({ messaje: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie  

    return res.json(updateMovie)
})




app.get('/movies/:id',(req,res)=>{
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)

    res.status(404).json({mensaje: 'movie not found'})
})



const PORT = process.env.PORT ??1234

app.listen(PORT,() => {
    console.log(`server listening on port http://localhost:${PORT}`)
})