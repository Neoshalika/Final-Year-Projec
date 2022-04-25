package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Salary;
import bit.project.server.dao.SalaryDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Allowance;
import bit.project.server.entity.Deduction;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Salaryloan;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
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
@RequestMapping("/salaries")
public class SalaryController{

    @Autowired
    private SalaryDao salaryDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SalaryController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("salary");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("SA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Salary> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all salaries", UsecaseList.SHOW_ALL_SALARIES);

        if(pageQuery.isEmptySearch()){
            return salaryDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");

        List<Salary> salaries = salaryDao.findAll(DEFAULT_SORT);
        Stream<Salary> stream = salaries.parallelStream();

        List<Salary> filteredSalaries = stream.filter(salary -> {
            if(code!=null)
                if(!salary.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(employeeId!=null)
                if(!salary.getEmployee().getId().equals(employeeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSalaries, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Salary> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all salaries' basic data", UsecaseList.SHOW_ALL_SALARIES);
        return salaryDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Salary get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get salary", UsecaseList.SHOW_SALARY_DETAILS);
        Optional<Salary> optionalSalary = salaryDao.findById(id);
        if(optionalSalary.isEmpty()) throw new ObjectNotFoundException("Salary not found");
        return optionalSalary.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete salaries", UsecaseList.DELETE_SALARY);

        try{
            if(salaryDao.existsById(id)) salaryDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this salary already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Salary salary, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new salary", UsecaseList.ADD_SALARY);

        salary.setTocreation(LocalDateTime.now());
        salary.setCreator(authUser);
        salary.setId(null);

        for(Allowance allowance : salary.getAllowanceList()) allowance.setSalary(salary);
        for(Salaryloan salaryloan : salary.getSalaryloanList()) salaryloan.setSalary(salary);
        for(Deduction deduction : salary.getDeductionList()) deduction.setSalary(salary);

        EntityValidator.validate(salary);

        PersistHelper.save(()->{
            salary.setCode(codeGenerator.getNextId(codeConfig));
            return salaryDao.save(salary);
        });

        return new ResourceLink(salary.getId(), "/salaries/"+salary.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Salary salary, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update salary details", UsecaseList.UPDATE_SALARY);

        Optional<Salary> optionalSalary = salaryDao.findById(id);
        if(optionalSalary.isEmpty()) throw new ObjectNotFoundException("Salary not found");
        Salary oldSalary = optionalSalary.get();

        salary.setId(id);
        salary.setCode(oldSalary.getCode());
        salary.setCreator(oldSalary.getCreator());
        salary.setTocreation(oldSalary.getTocreation());

        for(Allowance allowance : salary.getAllowanceList()) allowance.setSalary(salary);
        for(Salaryloan salaryloan : salary.getSalaryloanList()) salaryloan.setSalary(salary);
        for(Deduction deduction : salary.getDeductionList()) deduction.setSalary(salary);

        EntityValidator.validate(salary);

        salary = salaryDao.save(salary);
        return new ResourceLink(salary.getId(), "/salaries/"+salary.getId());
    }

}