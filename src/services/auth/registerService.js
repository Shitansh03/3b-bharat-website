import { request } from "../api";

/**
 * Register a new user
 * @param {Object} formData - The registration form data
 * @returns {Promise<Object>} - Response containing user password
 *
 * Body shape:
 * {
 *   "first_name": "Om",
 *   "last_name": "Ro",
 *   "user_date_of_birth": "2000-01-01",
 *   "user_email_id": "om.ro@example.com",
 *   "user_mob_no": "7219035526",
 *   "user_type": 1,              // 1 = student, 2 = industry
 *   "terms_and_conditions": true,
 *   "student_data": {             // present when user_type = 1
 *     "college_name": "...",
 *     "university_name": "...",
 *     "city": "..."
 *   },
 *   "industry_data": {            // present when user_type = 2
 *     "designation": "...",
 *     "organization_name": "...",
 *     "city": "..."
 *   }
 * }
 */
export const registerUser = async (formData) => {
  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    user_date_of_birth: formData.dob,
    user_email_id: formData.email,
    user_mob_no: formData.mobile,
    user_type: formData.role === "student" ? 1 : 2,
    terms_and_conditions: formData.termsAccepted,
  };

  if (formData.role === "student") {
    payload.student_data = {
      college_name: formData.collegeName,
      university_name: formData.universityName,
      city: formData.city,
    };
  } else if (formData.role === "industry") {
    payload.industry_data = {
      designation: formData.designation,
      organization_name: formData.organizationName,
      city: formData.city,
    };
  }

  return request("/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Verify the OTP entered by the user
 * @param {string} mobile - User mobile number
 * @param {string} otp - 4-digit OTP code
 * @returns {Promise<Object>}
 */
export const verifyOtp = async (mobile, otp) => {
  return request("/user/verify-otp", {
    method: "POST",
    body: JSON.stringify({ mobile, otp }),
  });
};
