export const StarsRating = ({rating, style}) => {
    const integerRating = Math.floor(rating)
    const ratingRemainder = Math.round((rating % 1) * 10)
    return (
        <div className={style}>
            {Array.from({ length: 5 }).map((_, index) => {
                const starNumber = index + 1;
                let starClass = 'fa-regular fa-star';

                if (starNumber <= integerRating) {
                    starClass = 'fa-solid fa-star';

                } else if (starNumber === integerRating + 1) {
                    if (ratingRemainder >= 8) {
                        starClass = 'fa-solid fa-star';
                    } else if (ratingRemainder >= 3) {
                        starClass = 'fa-solid fa-star-half-stroke';
                    }
                }
                return <i key={index} className={starClass}></i>;
            })}
        </div>
    )
}