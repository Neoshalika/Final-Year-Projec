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
import bit.project.server.entity.Paymentstatus;
import bit.project.server.entity.Supplierrefund;
import bit.project.server.dao.SupplierrefundDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Supplierrefundmaterial;
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
@RequestMapping("/supplierrefunds")
public class SupplierrefundController{

    @Autowired
    private SupplierrefundDao supplierrefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SupplierrefundController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("supplierrefund");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("SR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Supplierrefund> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all supplierrefunds", UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);

        if(pageQuery.isEmptySearch()){
            return supplierrefundDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        BigDecimal amount = pageQuery.getSearchParamAsDecimal("amount");
        String chequeno = pageQuery.getSearchParam("chequeno");

        List<Supplierrefund> supplierrefunds = supplierrefundDao.findAll(DEFAULT_SORT);
        Stream<Supplierrefund> stream = supplierrefunds.parallelStream();

        List<Supplierrefund> filteredSupplierrefunds = stream.filter(supplierrefund -> {
            if(code!=null)
                if(!supplierrefund.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(amount!=null)
                if(!supplierrefund.getAmount().equals(amount)) return false;
            if(chequeno!=null)
                if(!supplierrefund.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSupplierrefunds, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Supplierrefund> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all supplierrefunds' basic data", UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
        return supplierrefundDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Supplierrefund get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get supplierrefund", UsecaseList.SHOW_SUPPLIERREFUND_DETAILS);
        Optional<Supplierrefund> optionalSupplierrefund = supplierrefundDao.findById(id);
        if(optionalSupplierrefund.isEmpty()) throw new ObjectNotFoundException("Supplierrefund not found");
        return optionalSupplierrefund.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete supplierrefunds", UsecaseList.DELETE_SUPPLIERREFUND);

        try{
            if(supplierrefundDao.existsById(id)) supplierrefundDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this supplierrefund already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Supplierrefund supplierrefund, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new supplierrefund", UsecaseList.ADD_SUPPLIERREFUND);

        supplierrefund.setTocreation(LocalDateTime.now());
        supplierrefund.setCreator(authUser);
        supplierrefund.setId(null);
        supplierrefund.setPaymentstatus(new Paymentstatus(1));;

        for(Supplierrefundmaterial supplierrefundmaterial : supplierrefund.getSupplierrefundmaterialList()) supplierrefundmaterial.setSupplierrefund(supplierrefund);

        EntityValidator.validate(supplierrefund);

        PersistHelper.save(()->{
            supplierrefund.setCode(codeGenerator.getNextId(codeConfig));
            return supplierrefundDao.save(supplierrefund);
        });

        return new ResourceLink(supplierrefund.getId(), "/supplierrefunds/"+supplierrefund.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Supplierrefund supplierrefund, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update supplierrefund details", UsecaseList.UPDATE_SUPPLIERREFUND);

        Optional<Supplierrefund> optionalSupplierrefund = supplierrefundDao.findById(id);
        if(optionalSupplierrefund.isEmpty()) throw new ObjectNotFoundException("Supplierrefund not found");
        Supplierrefund oldSupplierrefund = optionalSupplierrefund.get();

        supplierrefund.setId(id);
        supplierrefund.setCode(oldSupplierrefund.getCode());
        supplierrefund.setCreator(oldSupplierrefund.getCreator());
        supplierrefund.setTocreation(oldSupplierrefund.getTocreation());

        for(Supplierrefundmaterial supplierrefundmaterial : supplierrefund.getSupplierrefundmaterialList()) supplierrefundmaterial.setSupplierrefund(supplierrefund);

        EntityValidator.validate(supplierrefund);

        supplierrefund = supplierrefundDao.save(supplierrefund);
        return new ResourceLink(supplierrefund.getId(), "/supplierrefunds/"+supplierrefund.getId());
    }

}