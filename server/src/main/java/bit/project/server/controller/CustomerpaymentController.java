package bit.project.server.controller;

import java.time.LocalDate;
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
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Customerpayment;
import bit.project.server.dao.CustomerpaymentDao;
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
@RequestMapping("/customerpayments")
public class CustomerpaymentController{

    @Autowired
    private CustomerpaymentDao customerpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomerpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customerpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customerpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customerpayments", UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return customerpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        String chequeno = pageQuery.getSearchParam("chequeno");

        List<Customerpayment> customerpayments = customerpaymentDao.findAll(DEFAULT_SORT);
        Stream<Customerpayment> stream = customerpayments.parallelStream();

        List<Customerpayment> filteredCustomerpayments = stream.filter(customerpayment -> {
            if(code!=null)
                if(!customerpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(paymentstatusId!=null)
                if(!customerpayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(chequeno!=null)
                if(!customerpayment.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomerpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customerpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerpayments' basic data", UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
        return customerpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customerpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customerpayment", UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
        Optional<Customerpayment> optionalCustomerpayment = customerpaymentDao.findById(id);
        if(optionalCustomerpayment.isEmpty()) throw new ObjectNotFoundException("Customerpayment not found");
        return optionalCustomerpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customerpayments", UsecaseList.DELETE_CUSTOMERPAYMENT);

        try{
            if(customerpaymentDao.existsById(id)) customerpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customerpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customerpayment customerpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customerpayment", UsecaseList.ADD_CUSTOMERPAYMENT);

        customerpayment.setTocreation(LocalDateTime.now());
        customerpayment.setCreator(authUser);
        customerpayment.setId(null);
        customerpayment.setDate(LocalDate.now());
        customerpayment.setPaymentstatus(new Paymentstatus(1));;
        customerpayment.setPaymentstatus(new Paymentstatus(1));;
        if (customerpayment.getPaymenttype().getId().equals(2)){
            customerpayment.setPaymentstatus(new Paymentstatus(2));;
        }

        EntityValidator.validate(customerpayment);

        PersistHelper.save(()->{
            customerpayment.setCode(codeGenerator.getNextId(codeConfig));
            return customerpaymentDao.save(customerpayment);
        });

        return new ResourceLink(customerpayment.getId(), "/customerpayments/"+customerpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customerpayment customerpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customerpayment details", UsecaseList.UPDATE_CUSTOMERPAYMENT);

        Optional<Customerpayment> optionalCustomerpayment = customerpaymentDao.findById(id);
        if(optionalCustomerpayment.isEmpty()) throw new ObjectNotFoundException("Customerpayment not found");
        Customerpayment oldCustomerpayment = optionalCustomerpayment.get();

        customerpayment.setId(id);
        customerpayment.setCode(oldCustomerpayment.getCode());
        customerpayment.setCreator(oldCustomerpayment.getCreator());
        customerpayment.setTocreation(oldCustomerpayment.getTocreation());


        EntityValidator.validate(customerpayment);

        customerpayment = customerpaymentDao.save(customerpayment);
        return new ResourceLink(customerpayment.getId(), "/customerpayments/"+customerpayment.getId());
    }

}
