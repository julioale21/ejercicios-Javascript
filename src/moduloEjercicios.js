import basededatos from './basededatos.js';


/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    const anioPromedio = basededatos.peliculas.reduce((total, pelicula) => total + pelicula.anio, 0) / basededatos.peliculas.length;
    return anioPromedio;
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
    const criticasPorPelicula = agruparCriticasPorPelicula();
    let peliculasConPromedioMayor = [];
    Object.keys(criticasPorPelicula).forEach((id) => {
        const criticaPromedio = criticasPorPelicula[id].reduce((total, calificacion) => total + calificacion.puntuacion , 0) / criticasPorPelicula[id].length;
        if (criticaPromedio > promedio) {
            const pelicula = basededatos.peliculas.find((pelicula) => pelicula.id == id);

             peliculasConPromedioMayor.push({
                ...pelicula,
                criticaPromedio
            })
        }
    });

    return peliculasConPromedioMayor;
};

const agruparCriticasPorPelicula = () => {
    return basededatos.calificaciones.reduce((array, item) => {
        (array[item.pelicula] = array[item.pelicula] || []).push(item)
        return array;
    }, {})
}

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    const director = basededatos.directores.find((director) => director.nombre === nombreDirector);
    const peliculasPorDirector = basededatos.peliculas.filter((pelicula) => pelicula.directores.includes(director.id))
    return peliculasPorDirector;
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
    const calificaciones = basededatos.calificaciones.filter((calificacion) => calificacion.pelicula === peliculaId);
    const calificacionMedia = calificaciones.reduce((total, calificacion) => total + calificacion.puntuacion, 0) / calificaciones.length;

    return calificacionMedia;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    // console.log(basededatos.peliculas);
    const peliculasConCalificacionExcelente = [];

    basededatos.calificaciones.forEach((calificacion) => {
        if (calificacion.puntuacion >= 9) {
            const pelicula = basededatos.peliculas.find((pelicula) => pelicula.id === calificacion.pelicula);
            peliculasConCalificacionExcelente.push(pelicula);
        }
    })
    return peliculasConCalificacionExcelente;
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
    const pelicula = basededatos.peliculas.find((pelicula) => pelicula.nombre === nombrePelicula);
    const directores = pelicula.directores.map((directorId) => {
        return basededatos.directores.find((director) => director.id === directorId);
    });
    pelicula.directores = directores;

    const generos = pelicula.generos.map((generoId) => {
        return basededatos.generos.find((genero) => genero.id === generoId);
    });
    pelicula.generos = generos;

    const calificacionesPorPelicula = basededatos.calificaciones.filter((calificacion) => calificacion.pelicula === pelicula.id);
    let criticas = [];

    calificacionesPorPelicula.forEach((calificacion) => {
        const critico = basededatos.criticos.find((critico) => critico.id === calificacion.critico);
        criticas.push({
            ...critico,
            puntuacion: calificacion.puntuacion
        })
    })

    pelicula.criticas = criticas;
    return pelicula;
};
