class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  // Filtering
  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ["sort", "limit", "page", "fields"]
    excludedFields.forEach((f) => delete queryObj[f])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(",").join(" ")
      this.query = this.query.sort(sortString)
    } else {
      // Default behavior: sort by createdAt in descending order
      this.query = this.query.sort("-createdAt")
    }

    return this
  }

  // Projection/Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }

    return this
  }

  // Pagination
  paginate() {
    const page = Number(this.queryString.page) || 1
    const limit = Number(this.queryString.limit) || 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
