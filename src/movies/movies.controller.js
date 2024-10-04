const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.product = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

async function list(req, res) {
  const isShowing = req.query.is_showing;
  if (isShowing) {
    res.json({ data: await moviesService.listMovie() });
  } else {
    res.json({ data: await moviesService.list() });
  }
}

async function listMovieTheaters(req, res) {
  const movie_id = req.params.movieId;
  res.json({ data: await moviesService.listMovieTheaters(movie_id) });
}

async function listMovieReviews(req, res) {
  const movie_id = req.params.movieId;
  const result = await moviesService.listMovieReviews(movie_id);
  res.json({ data: result });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
  listMovieTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listMovieTheaters),
  ],
  listMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listMovieReviews),
  ],
};