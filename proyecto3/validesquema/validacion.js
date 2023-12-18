const z = require('zod')




const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'movie title es incorrecto',
        required_error: 'Movie titw is requerido'
    }),
    año: z.number().int().positive().min(1990).max(2024),
    director: z.string(),
    genre: z.array(
        z.enum(['Action','Adventure','comedy','thriller'])
    )
    
})


function validarPelicula (object){
    return movieSchema.safeParse(object)
}


function validarPartialsMovie (object) {
    return movieSchema.partial().safeParse(object)
}


module.exports = {
    validarPelicula,
    validarPartialsMovie
}