class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "search"];
    excludedFields.forEach(field => delete queryObj[field]);
    this.query = this.query.find(queryObj);
    return this;
  }

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        title: {
          $regex: this.queryString.search,
          $options: "i"
        }
      })
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(",")
        .join(" ")

      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Math.min(Number(this.queryString.limit) || 10, 50);
    const skip = (page - 1) * limit;
    this.query = this.query
      .skip(skip)
      .limit(limit)

    this.page = page;
    this.limit = limit;

    return this;
  }
}

export default APIFeatures;