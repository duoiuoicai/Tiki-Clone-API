const advancedResults = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Select only field from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Remove removeFields from reqQuery
  removeFields.forEach(item => delete reqQuery[item]);

  let queryString = JSON.stringify(reqQuery);

  // Add $ to query string --> it become mongodb query
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  let query = model.find(JSON.parse(queryString));

  // Select query
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sorting query
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sorting by createdAt
    query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Execute the query
  const results = await query;

  // Paginating the result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    total: results.length,
    pagination: pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
