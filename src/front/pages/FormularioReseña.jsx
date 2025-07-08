import React from 'react';

export const FormularioReseña = ({ newReview, handleRatingChange, handleReviewChange, handleSubmitReview, isSubmitting, reviewMessage }) => {
    return (
        <div className="card shadow-sm rounded-4 mb-5">
            <div className="card-body p-4">
                <h3 className="font-title mb-3">Escribe tu reseña</h3>
                <form onSubmit={handleSubmitReview}>
                    <div className="mb-3">
                        <label className="form-label">Calificación:</label>
                        <div>
                            {[1, 2, 3, 4, 5].map(starValue => (
                                <i 
                                    key={starValue}
                                    className={`fa-star fs-3 me-1 ${starValue <= newReview.rating ? 'fa-solid text-warning' : 'fa-regular'} rating-starts`}
                                    onClick={() => handleRatingChange(starValue)}                                ></i>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Título de tu reseña:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control"
                            value={newReview.title}
                            onChange={handleReviewChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comment" className="form-label">Comentario:</label>
                        <textarea
                            id="comment"
                            name="comment"
                            className="form-control"
                            rows="4"
                            value={newReview.comment}
                            onChange={handleReviewChange}
                        ></textarea>
                    </div>
                    
                    {reviewMessage && (
                        <div className={`alert small p-2 mb-3 ${reviewMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {reviewMessage.text}
                        </div>
                    )}

                    <button type="submit" className="btn btn-custom-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};