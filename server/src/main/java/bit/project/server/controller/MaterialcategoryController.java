package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Materialcategory;
import bit.project.server.dao.MaterialcategoryDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/materialcategories")
public class MaterialcategoryController{

    @Autowired
    private MaterialcategoryDao materialcategoryDao;

    @GetMapping
    public List<Materialcategory> getAll(){
        return materialcategoryDao.findAll();
    }
}