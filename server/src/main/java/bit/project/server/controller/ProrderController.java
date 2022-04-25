package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Prorder;
import bit.project.server.dao.ProrderDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Prorderstatus;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Prordermaterial;
import bit.project.server.entity.Prorderemployee;
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
@RequestMapping("/prorders")
public class ProrderController{

    @Autowired
    private ProrderDao prorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProrderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("prorder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Prorder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all prorders", UsecaseList.SHOW_ALL_PRORDERS);

        if(pageQuery.isEmptySearch()){
            return prorderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customorderitemId = pageQuery.getSearchParamAsInteger("customorderitem");
        Integer productId = pageQuery.getSearchParamAsInteger("product");
        Integer prorderstatusId = pageQuery.getSearchParamAsInteger("prorderstatus");

        List<Prorder> prorders = prorderDao.findAll(DEFAULT_SORT);
        Stream<Prorder> stream = prorders.parallelStream();

        List<Prorder> filteredProrders = stream.filter(prorder -> {
            if(code!=null)
                if(!prorder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customorderitemId!=null)
                if(!prorder.getCustomorderitem().getId().equals(customorderitemId)) return false;
            if(productId!=null)
                if(!prorder.getProduct().getId().equals(productId)) return false;
            if(prorderstatusId!=null)
                if(!prorder.getProrderstatus().getId().equals(prorderstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProrders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Prorder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all prorders' basic data", UsecaseList.SHOW_ALL_PRORDERS, UsecaseList.ADD_PRMATERIALRETURN, UsecaseList.UPDATE_PRMATERIALRETURN);
        return prorderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Prorder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get prorder", UsecaseList.SHOW_PRORDER_DETAILS);
        Optional<Prorder> optionalProrder = prorderDao.findById(id);
        if(optionalProrder.isEmpty()) throw new ObjectNotFoundException("Prorder not found");
        return optionalProrder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete prorders", UsecaseList.DELETE_PRORDER);

        try{
            if(prorderDao.existsById(id)) prorderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this prorder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Prorder prorder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new prorder", UsecaseList.ADD_PRORDER);

        prorder.setTocreation(LocalDateTime.now());
        prorder.setCreator(authUser);
        prorder.setId(null);
        prorder.setProrderstatus(new Prorderstatus(1));;

        for(Prordermaterial prordermaterial : prorder.getPrordermaterialList()) prordermaterial.setProrder(prorder);
        for(Prorderemployee prorderemployee : prorder.getProrderemployeeList()) prorderemployee.setProrder(prorder);

        EntityValidator.validate(prorder);

        PersistHelper.save(()->{
            prorder.setCode(codeGenerator.getNextId(codeConfig));
            return prorderDao.save(prorder);
        });

        return new ResourceLink(prorder.getId(), "/prorders/"+prorder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Prorder prorder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update prorder details", UsecaseList.UPDATE_PRORDER);

        Optional<Prorder> optionalProrder = prorderDao.findById(id);
        if(optionalProrder.isEmpty()) throw new ObjectNotFoundException("Prorder not found");
        Prorder oldProrder = optionalProrder.get();

        prorder.setId(id);
        prorder.setCode(oldProrder.getCode());
        prorder.setCreator(oldProrder.getCreator());
        prorder.setTocreation(oldProrder.getTocreation());

        for(Prordermaterial prordermaterial : prorder.getPrordermaterialList()) prordermaterial.setProrder(prorder);
        for(Prorderemployee prorderemployee : prorder.getProrderemployeeList()) prorderemployee.setProrder(prorder);

        EntityValidator.validate(prorder);

        prorder = prorderDao.save(prorder);
        return new ResourceLink(prorder.getId(), "/prorders/"+prorder.getId());
    }


}
