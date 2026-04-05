const express = require("express");
const router = express.Router();
const {
  getApprenants,
  createApprenant,
  getApprenantById,
  updateApprenant,
  deleteApprenant,
} = require("../controllers/apprenantController");

router.route("/").get(getApprenants).post(createApprenant);

router
  .route("/:id")
  .get(getApprenantById)
  .put(updateApprenant)
  .delete(deleteApprenant);

module.exports = router;
