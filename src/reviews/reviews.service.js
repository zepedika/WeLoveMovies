const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}
async function update(review) {
  return knex("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  update,
  read,
  delete: destroy,
};