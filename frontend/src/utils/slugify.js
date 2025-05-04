/**
 * Chuyển đổi chuỗi thành slug URL
 * @param {string} text - Chuỗi cần chuyển đổi
 * @returns {string} - Slug URL
 */
export function slugify(text) {
  // Chuyển về chữ thường và loại bỏ dấu tiếng Việt
  const from = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ"
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyy"

  let result = text.toLowerCase()

  // Thay thế các ký tự có dấu
  for (let i = 0; i < from.length; i++) {
    result = result.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
  }

  // Thay thế các ký tự đặc biệt và khoảng trắng bằng dấu gạch ngang
  result = result
    .replace(/[^a-z0-9-]/g, "-") // Thay thế ký tự không phải chữ cái, số bằng dấu gạch ngang
    .replace(/-+/g, "-") // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu
    .replace(/^-+|-+$/g, "") // Xóa dấu gạch ngang ở đầu và cuối

  return result
}

/**
 * Tạo slug từ tên sản phẩm và ID
 * @param {string} name - Tên sản phẩm
 * @param {string} id - ID sản phẩm
 * @returns {string} - Slug URL
 */
export function createProductSlug(name) {
  return `${slugify(name)}`
}

/**
 * Trích xuất ID từ slug
 * @param {string} slug - Slug URL
 * @returns {string} - ID sản phẩm
 */
export function extractIdFromSlug(slug) {
  const parts = slug.split("-")
  return parts[parts.length - 1]
}
