import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProductReviews, addReview } from '../services/reviewService';

export default function ProductReviews({ productId }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getProductReviews(productId);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('You must be logged in to leave a review.');
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError('');
      setSubmitSuccess(false);
      
      const res = await addReview(productId, { rating, comment });
      if (res) {
        setSubmitSuccess(true);
        setComment('');
        setRating(5);
        fetchReviews(); // refresh
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-reviews-section" style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
      <h3>Customer Reviews & Feedback</h3>
      
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p style={{ color: 'var(--error)' }}>{error}</p>
      ) : (
        <div className="reviews-list" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to share your feedback!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="review-card" style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: 'var(--r-btn)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{rev.user?.name || 'Anonymous User'}</strong>
                  <span style={{ color: '#f39c12' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                </div>
                {rev.isVerifiedPurchase && <span style={{ fontSize: '11px', color: 'var(--success)', background: '#e0f5e9', padding: '3px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>Verified Purchase</span>}
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      <div className="review-form-container" style={{ background: 'var(--surface-50)', padding: '20px', borderRadius: 'var(--r-card)' }}>
        <h4>Leave Feedback</h4>
        {user ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {submitError && <div style={{ color: 'var(--error)' }}>{submitError}</div>}
            {submitSuccess && <div style={{ color: 'var(--success)' }}>Review submitted successfully!</div>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label>Rating</label>
              <div style={{ display: 'flex', gap: '5px', fontSize: '24px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    onClick={() => setRating(star)}
                    style={{ 
                      color: star <= rating ? '#f39c12' : '#ccc', 
                      cursor: 'pointer', 
                      transition: 'color 0.2s' 
                    }}
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </span>
                ))}
                <span style={{ fontSize: '14px', alignSelf: 'center', marginLeft: '10px', color: 'var(--text-muted)' }}>
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label>Your Review</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="What did you like or dislike?"
                style={{ padding: '10px', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--r-btn)', fontFamily: 'inherit' }}
                required
              />
            </div>

            <button type="submit" className="primary-cta" disabled={submitting} style={{ maxWidth: '200px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        ) : (
          <p style={{ marginTop: '10px' }}>You must be logged in to write a review.</p>
        )}
      </div>
    </div>
  );
}
