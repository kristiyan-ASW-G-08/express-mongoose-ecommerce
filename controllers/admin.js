const Product = require('../models/product');
const { validationResult } = require('express-validator/check');
const fileDelete = require('../util/fileDelete');
const pagination = require('../util/pagination');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    errorMessage: false,
    validationErrors: [],
    oldInput: {
      name: '',
      brand: '',
      price: '',
      availableUnits: '',
      screenSize: '',
      cpu: '',
      gpu: '',
      ram: '',
      memoryType: '',
      capacity: '',
      description: '',
      os: ''
    }
  });
};
exports.postAddProduct = async (req, res, next) => {
  try {
    const imageFile = req.file;
    let imageUrl = imageFile.path;

    const errors = validationResult(req);
    console.log(errors.array());
    const {
      name,
      brand,
      price,
      availableUnits,
      screenSize,
      cpu,
      gpu,
      ram,
      batteryLife,
      memoryType,
      capacity,
      description,
      os
    } = req.body;
    if (!imageFile) {
      fileDelete(imageUrl);
      return res.status(422).render('admin/add-product', {
        oldInput: {
          name,
          brand,
          price,
          availableUnits,
          screenSize,
          cpu,
          gpu,
          ram,
          memoryType,
          capacity,
          description,
          os
        },
        title: 'Add Product',
        path: 'admin/add-product',
        errorMessage: 'Attached file is not an image.',
        validationErrors: []
      });
    }
    if (!errors.isEmpty()) {
      fileDelete(imageUrl);
      return res.status(422).render('admin/add-product', {
        oldInput: {
          name,
          brand,
          price,
          availableUnits,
          screenSize,
          cpu,
          gpu,
          memoryType,
          capacity,
          ram,
          description,
          os
        },
        path: 'admin/add-product',
        title: 'Add Product',
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    } else {
      console.log('ok');
      const memory = {
        capacity,
        memoryType
      };
      const product = new Product({
        name,
        brand,
        price,
        availableUnits,
        screenSize,
        cpu,
        gpu,
        ram,
        memory,
        description,
        os,
        batteryLife,
        imageUrl
      });

      await product.save();
      res.redirect(`/`);
    }
  } catch (err) {
    console.log(err);
  }
};
exports.getProducts = async (req,res,next) => {

   try{
     const itemsPerPage = 4
    const paginationData = await pagination(req,itemsPerPage)
    const {products,totalItems,page} = paginationData
    console.log(products,totalItems,page)
    console.log(itemsPerPage * page < totalItems)
    res.render('admin/products', {
    products,
    title:'Products',
    path: 'admin/products',
    errorMessage:false,
    currentPage: page,
    hasNextPage: itemsPerPage * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / itemsPerPage)
  })
   }
   catch(err){
     console.log(err)
   }
  
}

// <% for (let product of products) { %>
  
//   <div class="column is-one-quarter">
//       <div class="card image-card">
//           <div class="card-image">
//               <figure class="image is-3by2">
//                <img src="/<%= image.imageUrl %>" alt="">
//               </figure>
//               <div class="card-content is-overlay is-clipped">
//                 <span class="tag is-info">
//                    Test
//                 </span>       
//               </div>
//               <div class="content">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Phasellus nec iaculis mauris. <a>@bulmaio</a>.
//                 <a href="#">#css</a> <a href="#">#responsive</a>
//                 <br>
//                 <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
//               </div>
//           </div>


// <% }  %> 