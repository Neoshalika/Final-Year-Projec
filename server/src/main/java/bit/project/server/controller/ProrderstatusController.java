package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Prorderstatus;
import bit.project.server.dao.ProrderstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/prorderstatuses")
public class ProrderstatusController{

    @Autowired
    private ProrderstatusDao prorderstatusDao;

    @GetMapping
    public List<Prorderstatus> getAll(){
        return prorderstatusDao.findAll();
    }
}