package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.entity.Loan;
import bit.project.server.dao.LoanDao;
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
@RequestMapping("/loans")
public class LoanController{

    @Autowired
    private LoanDao loanDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public LoanController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("loan");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("LO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Loan> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all loans", UsecaseList.SHOW_ALL_LOANS);

        if(pageQuery.isEmptySearch()){
            return loanDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");
        String chequeno = pageQuery.getSearchParam("chequeno");

        List<Loan> loans = loanDao.findAll(DEFAULT_SORT);
        Stream<Loan> stream = loans.parallelStream();

        List<Loan> filteredLoans = stream.filter(loan -> {
            if(code!=null)
                if(!loan.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(paymenttypeId!=null)
                if(!loan.getPaymenttype().getId().equals(paymenttypeId)) return false;
            if(chequeno!=null)
                if(!loan.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredLoans, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Loan> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all loans' basic data", UsecaseList.SHOW_ALL_LOANS, UsecaseList.ADD_LOANREPAYMENT, UsecaseList.UPDATE_LOANREPAYMENT);
        return loanDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Loan get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get loan", UsecaseList.SHOW_LOAN_DETAILS);
        Optional<Loan> optionalLoan = loanDao.findById(id);
        if(optionalLoan.isEmpty()) throw new ObjectNotFoundException("Loan not found");
        return optionalLoan.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete loans", UsecaseList.DELETE_LOAN);

        try{
            if(loanDao.existsById(id)) loanDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this loan already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Loan loan, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new loan", UsecaseList.ADD_LOAN);

        loan.setTocreation(LocalDateTime.now());
        loan.setCreator(authUser);
        loan.setId(null);
        loan.setPaymentstatus(new Paymentstatus(1));;


        EntityValidator.validate(loan);

        PersistHelper.save(()->{
            loan.setCode(codeGenerator.getNextId(codeConfig));
            return loanDao.save(loan);
        });

        return new ResourceLink(loan.getId(), "/loans/"+loan.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Loan loan, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update loan details", UsecaseList.UPDATE_LOAN);

        Optional<Loan> optionalLoan = loanDao.findById(id);
        if(optionalLoan.isEmpty()) throw new ObjectNotFoundException("Loan not found");
        Loan oldLoan = optionalLoan.get();

        loan.setId(id);
        loan.setCode(oldLoan.getCode());
        loan.setCreator(oldLoan.getCreator());
        loan.setTocreation(oldLoan.getTocreation());


        EntityValidator.validate(loan);

        loan = loanDao.save(loan);
        return new ResourceLink(loan.getId(), "/loans/"+loan.getId());
    }

}