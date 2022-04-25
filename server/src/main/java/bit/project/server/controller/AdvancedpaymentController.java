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
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Advancedpayment;
import bit.project.server.dao.AdvancedpaymentDao;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Advancedpaymentstatus;
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
@RequestMapping("/advancedpayments")
public class AdvancedpaymentController{

    @Autowired
    private AdvancedpaymentDao advancedpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public AdvancedpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("advancedpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("AP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Advancedpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all advancedpayments", UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return advancedpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");
        Integer advancedpaymentstatusId = pageQuery.getSearchParamAsInteger("advancedpaymentstatus");

        List<Advancedpayment> advancedpayments = advancedpaymentDao.findAll(DEFAULT_SORT);
        Stream<Advancedpayment> stream = advancedpayments.parallelStream();

        List<Advancedpayment> filteredAdvancedpayments = stream.filter(advancedpayment -> {
            if(code!=null)
                if(!advancedpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(employeeId!=null)
                if(!advancedpayment.getEmployee().getId().equals(employeeId)) return false;
            if(advancedpaymentstatusId!=null)
                if(!advancedpayment.getAdvancedpaymentstatus().getId().equals(advancedpaymentstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredAdvancedpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Advancedpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all advancedpayments' basic data", UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS, UsecaseList.ADD_SALARY, UsecaseList.UPDATE_SALARY);
        return advancedpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Advancedpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get advancedpayment", UsecaseList.SHOW_ADVANCEDPAYMENT_DETAILS);
        Optional<Advancedpayment> optionalAdvancedpayment = advancedpaymentDao.findById(id);
        if(optionalAdvancedpayment.isEmpty()) throw new ObjectNotFoundException("Advancedpayment not found");
        return optionalAdvancedpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete advancedpayments", UsecaseList.DELETE_ADVANCEDPAYMENT);

        try{
            if(advancedpaymentDao.existsById(id)) advancedpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this advancedpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Advancedpayment advancedpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new advancedpayment", UsecaseList.ADD_ADVANCEDPAYMENT);

        advancedpayment.setTocreation(LocalDateTime.now());
        advancedpayment.setCreator(authUser);
        advancedpayment.setId(null);
        advancedpayment.setAdvancedpaymentstatus(new Advancedpaymentstatus(1));;


        EntityValidator.validate(advancedpayment);

        PersistHelper.save(()->{
            advancedpayment.setCode(codeGenerator.getNextId(codeConfig));
            return advancedpaymentDao.save(advancedpayment);
        });

        return new ResourceLink(advancedpayment.getId(), "/advancedpayments/"+advancedpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Advancedpayment advancedpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update advancedpayment details", UsecaseList.UPDATE_ADVANCEDPAYMENT);

        Optional<Advancedpayment> optionalAdvancedpayment = advancedpaymentDao.findById(id);
        if(optionalAdvancedpayment.isEmpty()) throw new ObjectNotFoundException("Advancedpayment not found");
        Advancedpayment oldAdvancedpayment = optionalAdvancedpayment.get();

        advancedpayment.setId(id);
        advancedpayment.setCode(oldAdvancedpayment.getCode());
        advancedpayment.setCreator(oldAdvancedpayment.getCreator());
        advancedpayment.setTocreation(oldAdvancedpayment.getTocreation());


        EntityValidator.validate(advancedpayment);

        advancedpayment = advancedpaymentDao.save(advancedpayment);
        return new ResourceLink(advancedpayment.getId(), "/advancedpayments/"+advancedpayment.getId());
    }

}