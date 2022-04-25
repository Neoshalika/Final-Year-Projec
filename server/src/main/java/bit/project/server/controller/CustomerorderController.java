package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.*;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.dao.CustomerorderDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/customerorders")
public class CustomerorderController{

    @Autowired
    private CustomerorderDao customerorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomerorderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customerorder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customerorder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customerorders", UsecaseList.SHOW_ALL_CUSTOMERORDERS);

        if(pageQuery.isEmptySearch()){
            return customerorderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customerId = pageQuery.getSearchParamAsInteger("customer");

        List<Customerorder> customerorders = customerorderDao.findAll(DEFAULT_SORT);
        Stream<Customerorder> stream = customerorders.parallelStream();

        List<Customerorder> filteredCustomerorders = stream.filter(customerorder -> {
            if(code!=null)
                if(!customerorder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customerId!=null)
                if(!customerorder.getCustomer().getId().equals(customerId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomerorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customerorder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerorders' basic data", UsecaseList.SHOW_ALL_CUSTOMERORDERS, UsecaseList.ADD_CUSTOMERPAYMENT, UsecaseList.UPDATE_CUSTOMERPAYMENT, UsecaseList.ADD_CUSTOMERREFUND, UsecaseList.UPDATE_CUSTOMERREFUND, UsecaseList.ADD_CUSTOMORDERITEM, UsecaseList.UPDATE_CUSTOMORDERITEM, UsecaseList.ADD_DELIVERY, UsecaseList.UPDATE_DELIVERY);
        return customerorderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customerorder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customerorder", UsecaseList.SHOW_CUSTOMERORDER_DETAILS);
        Optional<Customerorder> optionalCustomerorder = customerorderDao.findById(id);
        if(optionalCustomerorder.isEmpty()) throw new ObjectNotFoundException("Customerorder not found");
        return optionalCustomerorder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customerorders", UsecaseList.DELETE_CUSTOMERORDER);

        try{
            if(customerorderDao.existsById(id)) customerorderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customerorder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customerorder customerorder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customerorder", UsecaseList.ADD_CUSTOMERORDER);

        customerorder.setTocreation(LocalDateTime.now());
        customerorder.setCreator(authUser);
        customerorder.setId(null);
        customerorder.setCustomerorderstatus(new Customerorderstatus(1));;

        for(Customerorderproduct customerorderproduct : customerorder.getCustomerorderproductList()) customerorderproduct.setCustomerorder(customerorder);

        EntityValidator.validate(customerorder);

        PersistHelper.save(()->{
            customerorder.setCode(codeGenerator.getNextId(codeConfig));
            return customerorderDao.save(customerorder);
        });

        return new ResourceLink(customerorder.getId(), "/customerorders/"+customerorder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customerorder customerorder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customerorder details", UsecaseList.UPDATE_CUSTOMERORDER);

        Optional<Customerorder> optionalCustomerorder = customerorderDao.findById(id);
        if(optionalCustomerorder.isEmpty()) throw new ObjectNotFoundException("Customerorder not found");
        Customerorder oldCustomerorder = optionalCustomerorder.get();

        customerorder.setId(id);
        customerorder.setCode(oldCustomerorder.getCode());
        customerorder.setCreator(oldCustomerorder.getCreator());
        customerorder.setTocreation(oldCustomerorder.getTocreation());

        for(Customerorderproduct customerorderproduct : customerorder.getCustomerorderproductList()) customerorderproduct.setCustomerorder(customerorder);

        EntityValidator.validate(customerorder);

        customerorder = customerorderDao.save(customerorder);
        return new ResourceLink(customerorder.getId(), "/customerorders/"+customerorder.getId());
    }
    @GetMapping("/forcustomorderitem")
    public List<Customerorder> getAllForcustomOrderItem(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerorders' basic data", UsecaseList.SHOW_ALL_CUSTOMERORDERS, UsecaseList.ADD_CUSTOMERPAYMENT, UsecaseList.UPDATE_CUSTOMERPAYMENT, UsecaseList.ADD_CUSTOMERREFUND, UsecaseList.UPDATE_CUSTOMERREFUND, UsecaseList.ADD_CUSTOMORDERITEM, UsecaseList.UPDATE_CUSTOMORDERITEM, UsecaseList.ADD_DELIVERY, UsecaseList.UPDATE_DELIVERY);
        return customerorderDao.getAllForcustomOrderItem();
    }

    @GetMapping("/forpaymentbycustomer/{id}")
    public List<Customerorder> getAllForPaymentByCustomer(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerorders' basic data", UsecaseList.SHOW_ALL_CUSTOMERORDERS, UsecaseList.ADD_CUSTOMERPAYMENT, UsecaseList.UPDATE_CUSTOMERPAYMENT, UsecaseList.ADD_CUSTOMERREFUND, UsecaseList.UPDATE_CUSTOMERREFUND, UsecaseList.ADD_CUSTOMORDERITEM, UsecaseList.UPDATE_CUSTOMORDERITEM, UsecaseList.ADD_DELIVERY, UsecaseList.UPDATE_DELIVERY);
        return customerorderDao.getAllForPaymentByCustomer(id);
    }

    @GetMapping("/bycustomer/{id}")
    public List<Customerorder> getAllByCustomer(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerorders' basic data", UsecaseList.SHOW_ALL_CUSTOMERORDERS, UsecaseList.ADD_CUSTOMERPAYMENT, UsecaseList.UPDATE_CUSTOMERPAYMENT, UsecaseList.ADD_CUSTOMERREFUND, UsecaseList.UPDATE_CUSTOMERREFUND, UsecaseList.ADD_CUSTOMORDERITEM, UsecaseList.UPDATE_CUSTOMORDERITEM, UsecaseList.ADD_DELIVERY, UsecaseList.UPDATE_DELIVERY);
        return customerorderDao.getAllForPaymentByCustomerfordetail(id);
    }

}
