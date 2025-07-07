export const RatingBreakdown = ({ reviews }) => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
        return <p>Aún no hay calificaciones.</p>;
    }
    const ratingPercentages = {
        5: (reviews.filter(r => r.rating === 5).length / totalReviews) * 100,
        4: (reviews.filter(r => r.rating === 4).length / totalReviews) * 100,
        3: (reviews.filter(r => r.rating === 3).length / totalReviews) * 100,
        2: (reviews.filter(r => r.rating === 2).length / totalReviews) * 100,
        1: (reviews.filter(r => r.rating === 1).length / totalReviews) * 100,
    };

    return (
        <div className="rating fs-5">
            {[5, 4, 3, 2, 1].map(starValue => (
                <div key={starValue} className="d-flex align-items-center mb-2 ">
                    <span className="ms-3 pe-2">{starValue} <i className="fa-solid fa-star "></i></span>
                    <div className="progress flex-grow-1" style={{ height: '20px' }}>
                        <div
                            className="progress-bar terracota"
                            role="progressbar"
                            style={{ width: `${ratingPercentages[starValue]}%` }}
                            aria-valuenow={ratingPercentages[starValue]}
                            aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};