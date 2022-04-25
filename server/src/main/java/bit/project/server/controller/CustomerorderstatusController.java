package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Customerorderstatus;
import bit.project.server.dao.CustomerorderstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/customerorderstatuses")
public class CustomerorderstatusController{

    @Autowired
    private CustomerorderstatusDao customerorderstatusDao;

    @GetMapping
    public List<Customerorderstatus> getAll(){
        return customerorderstatusDao.findAll();
    }
}