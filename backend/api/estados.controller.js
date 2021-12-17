import estadosDAO from "../dao/estadosDAO.js";

export default class StatusController {
  //esta api se llama por medio de una url que puede ser una query string que es una forma en la q podemos especificar parametros
  //restaurantsPerPage será igual a lo que se le pase atravez de la url (query string), despues la convierte a un int y si no existe el default es 20
  static async apiGetRoutes(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {}; //iniciará como un objecto vacio, si en la url esta el filtro de cuisine, filters.cuisine será igual al query q se pase
    if (req.query.status) {
      filters.status = req.query.status;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    //ahora q ya tenemos los filtros (si es q se escogieron filtros) podemos pasarlos aquí
    //esto va a retornar una lista de restaurantes (restaurantList) y el numero total de restaurantes(totalNumRestaurants)
    const { dataList, totalNumRestaurants } = await estadosDAO.getAllData({
      filters,
      page,
      restaurantsPerPage,
    });

    //creamos una respuesta para enviar a la persona cuando esta api url se llame
    let response = {
      restaurants: dataList, //le enviamos la lista de restaurantes, pagina, filtros etc
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    res.json(response); //aqui es donde enviamos la respuesta en un formato json
  }

  static async apiGetEstados(req, res, next) {
    try {
      let status = await estadosDAO.getEstados();
      res.json(status);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
