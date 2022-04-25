package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Supplierreturnstatus;
import bit.project.server.dao.SupplierreturnstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/supplierreturnstatuses")
public class SupplierreturnstatusController{

    @Autowired
    private SupplierreturnstatusDao supplierreturnstatusDao;

    @GetMapping
    public List<Supplierreturnstatus> getAll(){
        return supplierreturnstatusDao.findAll();
    }
}