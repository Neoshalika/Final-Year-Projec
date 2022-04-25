package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Productstatus;
import bit.project.server.dao.ProductstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/productstatuses")
public class ProductstatusController{

    @Autowired
    private ProductstatusDao productstatusDao;

    @GetMapping
    public List<Productstatus> getAll(){
        return productstatusDao.findAll();
    }
}