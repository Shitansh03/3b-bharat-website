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
 *   "country_code": "+91",
 *   "user_type": 1,              // 1 = student, 2 = employee
 *   "terms_and_conditions": 1,
 *   "student_data": {             // present when user_type = 1
 *     "college_name": "...",
 *     "university_name": "..."
 *   },
 *   "employee_data": {            // present when user_type = 2
 *     "designation": "...",
 *     "org_name": "..."
 *   }
 * }
 */
export const registerUser = async (formData) => {
  const categoryMap = { road: 1, bridge: 2, railway: 3, metro: 4 };
  const user_login_type = categoryMap[formData.category?.toLowerCase()] || 1;

  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    user_date_of_birth: formData.dob,
    user_email_id: formData.email,
    user_mob_no: formData.mobile,
    country_code: formData.countryCode || "+91",
    user_type: formData.role === "student" ? 1 : 2,
    user_login_type,
    terms_and_conditions: 1,
  };

  if (formData.role === "student") {
    payload.student_data = {
      college_name: formData.collegeName,
      university_name: formData.universityName,
    };
  } else if (formData.role === "industry") {
    payload.employee_data = {
      designation: formData.designation,
      org_name: formData.organizationName,
    };
  }

  return request("/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Generate OTP for a mobile number
 * @param {string} mobile - User mobile number
 * @returns {Promise<Object>}
 */
export const generateOtp = async (mobile) => {
  return request("/user/generate-otp", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
};

/**
 * Verify the OTP entered by the user
 * @param {Object} params - { mobile, otp } or { euh_id, otp }
 * @returns {Promise<Object>}
 */
export const verifyOtp = async (mobile, otp, euh_id = null) => {
  const payload = { otp };
  if (euh_id) {
    payload.euh_id = euh_id;
  } else {
    payload.mobile = mobile;
  }
  return request("/user/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
