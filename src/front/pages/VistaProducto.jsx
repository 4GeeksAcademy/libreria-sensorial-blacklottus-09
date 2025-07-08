import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/products";
import { useEffect, useState } from "react";
import { RatingBreakdown } from "../components/RatingBreakdown";
import { StarsRating } from "../components/StarsRating";
import { ProductCard } from "../components/ProductCard";
import { ProductCarousel } from "../components/ProductCarousel";
import { ProductDetails } from "../components/ProductsDetails";
import { FormularioReseña } from "./FormularioReseña";

export const VistaProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const { products } = store;

  let timer;
  const fetchProductData = async () => {
    try {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
      }, 30000);

      const product_fetch = await getProduct(id);
      if (product_fetch) {
        setProduct(product_fetch);
        if (product_fetch.images && product_fetch.images.length > 0) {
          setSelectedImage(product_fetch.images[0]);
        }
        setQuantity(1);
      } else {
      }
    } catch (err) {
      console.error("Error al cargar el producto:", err);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchProductData();
    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock_quantity) {
      dispatch({
        type: "ADD_TO_CART",
        payload: { product: product, quantity: quantity },
      });

    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };
  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (newReview.rating === 0) {
      setReviewMessage({ type: 'error', text: 'Por favor, selecciona una calificación.' });
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage(null);

    try {
      console.log({ "token": store.token })

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.token.token}`
        },
        body: JSON.stringify(newReview)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Error al enviar la reseña.");

      setReviewMessage({ type: 'success', text: '¡Gracias por tu reseña!' });
      setNewReview({ rating: 0, title: '', comment: '' });
      fetchProductData();
    } catch (error) {
      setReviewMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const canLeaveReview = store.token && product && !product.reviews.some(review => review.user_id === store.user?.id);


  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-grow text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div className="spinner-grow text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div className="spinner-grow text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }



  if (!product) {
    return (
      <div className="alert text-white terracota fs-3 fw-bold text-center mx-5" role="alert">
        Producto no disponible.
      </div>
    );
  }

  const { images } = product;

  return (
    <div className="container py-2 background-focus">
      <div className="mobile d-md-none">
        <div className="row">
          <div className="text-center font-title col-12">
            <b>
              <p className="fs-2 text">{product.name}</p>
            </b>
          </div>
          <div id="product-carousel" className="carousel slide ">
            <ProductCarousel
              images={product.images}
              carouselId="vistaPrincipalCarousel"
            />
          </div>
          <ProductDetails
            product={product}
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
            title={product.name}
          />
        </div>
      </div>

      <div className="big-screen d-none d-lg-block">
        <div className="row g-4 ">
          <div className="col-1">
            {images.map((image, index) => (
              <div key={image.id || index}>
                <img
                  src={image.image_url}
                  className={`img-thumbnail rounded mb-2 thumbnail-image ${selectedImage?.image_url === image.image_url
                    ? "border-primary"
                    : ""
                    }`}
                  alt={image.alt_text}
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>
          <div className="col-6">
            <div className="border border-secondary rounded overflow-hidden justify-content-center">
              {selectedImage && (
                <img
                  src={selectedImage.image_url}
                  className="img-fluid p-1"
                  alt={selectedImage.alt_text}
                />
              )}
            </div>
          </div>
          <div className="col-5 border border-secondary rounded p-4">
            <ProductDetails
              product={product}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              title={product.name}
            />
          </div>
        </div>
      </div>

      <div className="text-center pt-5">
        <p className="fs-2">Productos Relacionados</p>
        <div className="row my-5 justify-content-center">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((relatedProduct) => (

              <div key={relatedProduct.id} className="col-lg-3 col-md-6 mb-4">
                <ProductCard product={relatedProduct} />
              </div>
            ))}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4 col-12 ">
          <div className="d-flex align-items-start">
            <p className="fs-1">{product.average_rating.toFixed(1)}</p>
            <div>
              <StarsRating rating={product.average_rating} style="ms-2" />
              <p className="px-2">
                {product.reviews.length}{" "}
                {product.reviews.length === 1 ? "calificación" : "calificaciones"}
              </p>
            </div>
          </div>
          <RatingBreakdown reviews={product.reviews}></RatingBreakdown>
        </div>

        <div className="col-md-8 col-12 ">
          {canLeaveReview && (
            <FormularioReseña
              newReview={newReview}
              handleRatingChange={handleRatingChange}
              handleReviewChange={handleReviewChange}
              handleSubmitReview={handleSubmitReview}
              isSubmitting={isSubmittingReview}
              reviewMessage={reviewMessage}
            />
          )}

          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.slice(0, 10).map((review, index) => (
              <div key={review.id || index} className="pb-4 border-bottom mb-3">
                <div className="user d-flex align-items-center mb-2">
                  <img
                    src={review.avatar || "https://picsum.photos/50"}
                    alt={review.user_name}
                    className="user-picture me-3 border border-secondary rounded-circle "
                  />
                  <p className="mb-0 fs-4 fw-bold">{review.user_name}</p>
                </div>
                <div className="rate-title d-flex align-items-center mb-2 fs-5">
                  <StarsRating rating={review.rating} />
                  <h5 className="mb-0 ms-3 fw-bold">{review.title}</h5>
                </div>
                <div className="created text-muted mb-2">
                  <p className="mb-0">
                    Creado el {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="review">
                  <p className="fs-5">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p>Aún no hay reseñas para este producto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};