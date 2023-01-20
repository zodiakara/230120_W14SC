import express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";

const productsRouter = express.Router();

// add product
productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// get all with pagination
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// get edit delete single product
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// crud for embedded reviews:

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const newReview = {
      ...req.body,
    };
    if (newReview) {
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        { $push: { reviews: newReview } },
        { new: true, runValidators: true }
      );
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      res.send(product.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const singleReview = product.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (singleReview) {
        res.send(singleReview);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId}not found!!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByIdAndUpdate(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (index !== -1) {
        const editedComment = product.reviews[index].toObject();
        product.reviews[index] = {
          ...editedComment,
          ...req.body,
          updatedAt: new Date(),
        };
        await product.save();
        res.send(product);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId}not found!!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.reviewId,
        { $pull: { reviews: { _id: req.params.reviewId } } }
      );
      if (updatedProduct) {
        res.status(204).send(updatedProduct);
        console.log(
          `Review with id ${req.params.reviewId} successfully deleted`
        );
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId}not found!!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
