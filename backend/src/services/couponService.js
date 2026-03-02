const Coupon = require('../models/Coupon');

const applyCoupon = async (code, subtotal) => {
  if (!code) return { discount: 0, coupon: null };
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return { discount: 0, coupon: null };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { discount: 0, coupon: null };
  if (subtotal < coupon.minOrderAmount) return { discount: 0, coupon: null };
  const rawDiscount = coupon.discountType === 'FLAT'
    ? coupon.discountValue
    : subtotal * (coupon.discountValue / 100);
  const discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  return { discount, coupon };
};

module.exports = { applyCoupon };
