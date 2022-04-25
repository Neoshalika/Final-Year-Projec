package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Productcategory;
import bit.project.server.dao.ProductcategoryDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/productcategories")
public class ProductcategoryController{

    @Autowired
    private ProductcategoryDao productcategoryDao;

    @GetMapping
    public List<Productcategory> getAll(){
        return productcategoryDao.findAll();
    }
}