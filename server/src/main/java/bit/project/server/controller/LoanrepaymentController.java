package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
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
import bit.project.server.entity.Loanrepayment;
import bit.project.server.dao.LoanrepaymentDao;
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
@RequestMapping("/loanrepayments")
public class LoanrepaymentController{

    @Autowired
    private LoanrepaymentDao loanrepaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public LoanrepaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("loanrepayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("LR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Loanrepayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all loanrepayments", UsecaseList.SHOW_ALL_LOANREPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return loanrepaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer loanId = pageQuery.getSearchParamAsInteger("loan");
        BigDecimal amount = pageQuery.getSearchParamAsDecimal("amount");

        List<Loanrepayment> loanrepayments = loanrepaymentDao.findAll(DEFAULT_SORT);
        Stream<Loanrepayment> stream = loanrepayments.parallelStream();

        List<Loanrepayment> filteredLoanrepayments = stream.filter(loanrepayment -> {
            if(code!=null)
                if(!loanrepayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(loanId!=null)
                if(!loanrepayment.getLoan().getId().equals(loanId)) return false;
            if(amount!=null)
                if(!loanrepayment.getAmount().equals(amount)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredLoanrepayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Loanrepayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all loanrepayments' basic data", UsecaseList.SHOW_ALL_LOANREPAYMENTS);
        return loanrepaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Loanrepayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get loanrepayment", UsecaseList.SHOW_LOANREPAYMENT_DETAILS);
        Optional<Loanrepayment> optionalLoanrepayment = loanrepaymentDao.findById(id);
        if(optionalLoanrepayment.isEmpty()) throw new ObjectNotFoundException("Loanrepayment not found");
        return optionalLoanrepayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete loanrepayments", UsecaseList.DELETE_LOANREPAYMENT);

        try{
            if(loanrepaymentDao.existsById(id)) loanrepaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this loanrepayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Loanrepayment loanrepayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new loanrepayment", UsecaseList.ADD_LOANREPAYMENT);

        loanrepayment.setTocreation(LocalDateTime.now());
        loanrepayment.setCreator(authUser);
        loanrepayment.setId(null);


        EntityValidator.validate(loanrepayment);

        PersistHelper.save(()->{
            loanrepayment.setCode(codeGenerator.getNextId(codeConfig));
            return loanrepaymentDao.save(loanrepayment);
        });

        return new ResourceLink(loanrepayment.getId(), "/loanrepayments/"+loanrepayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Loanrepayment loanrepayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update loanrepayment details", UsecaseList.UPDATE_LOANREPAYMENT);

        Optional<Loanrepayment> optionalLoanrepayment = loanrepaymentDao.findById(id);
        if(optionalLoanrepayment.isEmpty()) throw new ObjectNotFoundException("Loanrepayment not found");
        Loanrepayment oldLoanrepayment = optionalLoanrepayment.get();

        loanrepayment.setId(id);
        loanrepayment.setCode(oldLoanrepayment.getCode());
        loanrepayment.setCreator(oldLoanrepayment.getCreator());
        loanrepayment.setTocreation(oldLoanrepayment.getTocreation());


        EntityValidator.validate(loanrepayment);

        loanrepayment = loanrepaymentDao.save(loanrepayment);
        return new ResourceLink(loanrepayment.getId(), "/loanrepayments/"+loanrepayment.getId());
    }

}