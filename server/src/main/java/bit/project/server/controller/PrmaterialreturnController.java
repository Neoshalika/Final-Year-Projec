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
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Prmaterialreturn;
import bit.project.server.dao.PrmaterialreturnDao;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.entity.Prmaterialreturnmaterial;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/prmaterialreturns")
public class PrmaterialreturnController{

    @Autowired
    private PrmaterialreturnDao prmaterialreturnDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PrmaterialreturnController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("prmaterialreturn");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Prmaterialreturn> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all prmaterialreturns", UsecaseList.SHOW_ALL_PRMATERIALRETURNS);

        if(pageQuery.isEmptySearch()){
            return prmaterialreturnDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer prorderId = pageQuery.getSearchParamAsInteger("prorder");

        List<Prmaterialreturn> prmaterialreturns = prmaterialreturnDao.findAll(DEFAULT_SORT);
        Stream<Prmaterialreturn> stream = prmaterialreturns.parallelStream();

        List<Prmaterialreturn> filteredPrmaterialreturns = stream.filter(prmaterialreturn -> {
            if(code!=null)
                if(!prmaterialreturn.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(prorderId!=null)
                if(!prmaterialreturn.getProrder().getId().equals(prorderId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPrmaterialreturns, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Prmaterialreturn> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all prmaterialreturns' basic data", UsecaseList.SHOW_ALL_PRMATERIALRETURNS);
        return prmaterialreturnDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Prmaterialreturn get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get prmaterialreturn", UsecaseList.SHOW_PRMATERIALRETURN_DETAILS);
        Optional<Prmaterialreturn> optionalPrmaterialreturn = prmaterialreturnDao.findById(id);
        if(optionalPrmaterialreturn.isEmpty()) throw new ObjectNotFoundException("Prmaterialreturn not found");
        return optionalPrmaterialreturn.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete prmaterialreturns", UsecaseList.DELETE_PRMATERIALRETURN);

        try{
            if(prmaterialreturnDao.existsById(id)) prmaterialreturnDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this prmaterialreturn already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Prmaterialreturn prmaterialreturn, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new prmaterialreturn", UsecaseList.ADD_PRMATERIALRETURN);

        prmaterialreturn.setTocreation(LocalDateTime.now());
        prmaterialreturn.setCreator(authUser);
        prmaterialreturn.setId(null);

        for(Prmaterialreturnmaterial prmaterialreturnmaterial : prmaterialreturn.getPrmaterialreturnmaterialList()) prmaterialreturnmaterial.setPrmaterialreturn(prmaterialreturn);

        EntityValidator.validate(prmaterialreturn);

        PersistHelper.save(()->{
            prmaterialreturn.setCode(codeGenerator.getNextId(codeConfig));
            return prmaterialreturnDao.save(prmaterialreturn);
        });

        return new ResourceLink(prmaterialreturn.getId(), "/prmaterialreturns/"+prmaterialreturn.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Prmaterialreturn prmaterialreturn, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update prmaterialreturn details", UsecaseList.UPDATE_PRMATERIALRETURN);

        Optional<Prmaterialreturn> optionalPrmaterialreturn = prmaterialreturnDao.findById(id);
        if(optionalPrmaterialreturn.isEmpty()) throw new ObjectNotFoundException("Prmaterialreturn not found");
        Prmaterialreturn oldPrmaterialreturn = optionalPrmaterialreturn.get();

        prmaterialreturn.setId(id);
        prmaterialreturn.setCode(oldPrmaterialreturn.getCode());
        prmaterialreturn.setCreator(oldPrmaterialreturn.getCreator());
        prmaterialreturn.setTocreation(oldPrmaterialreturn.getTocreation());

        for(Prmaterialreturnmaterial prmaterialreturnmaterial : prmaterialreturn.getPrmaterialreturnmaterialList()) prmaterialreturnmaterial.setPrmaterialreturn(prmaterialreturn);

        EntityValidator.validate(prmaterialreturn);

        prmaterialreturn = prmaterialreturnDao.save(prmaterialreturn);
        return new ResourceLink(prmaterialreturn.getId(), "/prmaterialreturns/"+prmaterialreturn.getId());
    }

}