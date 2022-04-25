package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Deliverystatus;
import bit.project.server.dao.DeliverystatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/deliverystatuses")
public class DeliverystatusController{

    @Autowired
    private DeliverystatusDao deliverystatusDao;

    @GetMapping
    public List<Deliverystatus> getAll(){
        return deliverystatusDao.findAll();
    }
}