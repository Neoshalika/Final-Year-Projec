package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Paymentstatus;
import bit.project.server.entity.Customerrefund;
import bit.project.server.dao.CustomerrefundDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Customerrefundproduct;
import bit.project.server.entity.Customorderrefunditem;
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
@RequestMapping("/customerrefunds")
public class CustomerrefundController{

    @Autowired
    private CustomerrefundDao customerrefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomerrefundController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customerrefund");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customerrefund> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customerrefunds", UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);

        if(pageQuery.isEmptySearch()){
            return customerrefundDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customerorderId = pageQuery.getSearchParamAsInteger("customerorder");
        String chequeno = pageQuery.getSearchParam("chequeno");

        List<Customerrefund> customerrefunds = customerrefundDao.findAll(DEFAULT_SORT);
        Stream<Customerrefund> stream = customerrefunds.parallelStream();

        List<Customerrefund> filteredCustomerrefunds = stream.filter(customerrefund -> {
            if(code!=null)
                if(!customerrefund.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customerorderId!=null)
                if(!customerrefund.getCustomerorder().getId().equals(customerorderId)) return false;
            if(chequeno!=null)
                if(!customerrefund.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomerrefunds, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customerrefund> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerrefunds' basic data", UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
        return customerrefundDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customerrefund get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customerrefund", UsecaseList.SHOW_CUSTOMERREFUND_DETAILS);
        Optional<Customerrefund> optionalCustomerrefund = customerrefundDao.findById(id);
        if(optionalCustomerrefund.isEmpty()) throw new ObjectNotFoundException("Customerrefund not found");
        return optionalCustomerrefund.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customerrefunds", UsecaseList.DELETE_CUSTOMERREFUND);

        try{
            if(customerrefundDao.existsById(id)) customerrefundDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customerrefund already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customerrefund customerrefund, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customerrefund", UsecaseList.ADD_CUSTOMERREFUND);

        customerrefund.setTocreation(LocalDateTime.now());
        customerrefund.setCreator(authUser);
        customerrefund.setId(null);
        customerrefund.setPaymentstatus(new Paymentstatus(1));;

        for(Customerrefundproduct customerrefundproduct : customerrefund.getCustomerrefundproductList()) customerrefundproduct.setCustomerrefund(customerrefund);
        for(Customorderrefunditem customorderrefunditem : customerrefund.getCustomorderrefunditemList()) customorderrefunditem.setCustomerrefund(customerrefund);

        EntityValidator.validate(customerrefund);

        PersistHelper.save(()->{
            customerrefund.setCode(codeGenerator.getNextId(codeConfig));
            return customerrefundDao.save(customerrefund);
        });

        return new ResourceLink(customerrefund.getId(), "/customerrefunds/"+customerrefund.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customerrefund customerrefund, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customerrefund details", UsecaseList.UPDATE_CUSTOMERREFUND);

        Optional<Customerrefund> optionalCustomerrefund = customerrefundDao.findById(id);
        if(optionalCustomerrefund.isEmpty()) throw new ObjectNotFoundException("Customerrefund not found");
        Customerrefund oldCustomerrefund = optionalCustomerrefund.get();

        customerrefund.setId(id);
        customerrefund.setCode(oldCustomerrefund.getCode());
        customerrefund.setCreator(oldCustomerrefund.getCreator());
        customerrefund.setTocreation(oldCustomerrefund.getTocreation());

        for(Customerrefundproduct customerrefundproduct : customerrefund.getCustomerrefundproductList()) customerrefundproduct.setCustomerrefund(customerrefund);
        for(Customorderrefunditem customorderrefunditem : customerrefund.getCustomorderrefunditemList()) customorderrefunditem.setCustomerrefund(customerrefund);

        EntityValidator.validate(customerrefund);

        customerrefund = customerrefundDao.save(customerrefund);
        return new ResourceLink(customerrefund.getId(), "/customerrefunds/"+customerrefund.getId());
    }

}