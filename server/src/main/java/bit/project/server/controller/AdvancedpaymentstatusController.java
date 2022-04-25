package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Advancedpaymentstatus;
import bit.project.server.dao.AdvancedpaymentstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/advancedpaymentstatuses")
public class AdvancedpaymentstatusController{

    @Autowired
    private AdvancedpaymentstatusDao advancedpaymentstatusDao;

    @GetMapping
    public List<Advancedpaymentstatus> getAll(){
        return advancedpaymentstatusDao.findAll();
    }
}