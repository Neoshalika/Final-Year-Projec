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
import bit.project.server.entity.Productdisposal;
import bit.project.server.dao.ProductdisposalDao;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Productdisposalproduct;
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
@RequestMapping("/productdisposals")
public class ProductdisposalController{

    @Autowired
    private ProductdisposalDao productdisposalDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProductdisposalController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("productdisposal");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PD");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Productdisposal> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all productdisposals", UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);

        if(pageQuery.isEmptySearch()){
            return productdisposalDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Productdisposal> productdisposals = productdisposalDao.findAll(DEFAULT_SORT);
        Stream<Productdisposal> stream = productdisposals.parallelStream();

        List<Productdisposal> filteredProductdisposals = stream.filter(productdisposal -> {
            if(code!=null)
                if(!productdisposal.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProductdisposals, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Productdisposal> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all productdisposals' basic data", UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
        return productdisposalDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Productdisposal get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get productdisposal", UsecaseList.SHOW_PRODUCTDISPOSAL_DETAILS);
        Optional<Productdisposal> optionalProductdisposal = productdisposalDao.findById(id);
        if(optionalProductdisposal.isEmpty()) throw new ObjectNotFoundException("Productdisposal not found");
        return optionalProductdisposal.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete productdisposals", UsecaseList.DELETE_PRODUCTDISPOSAL);

        try{
            if(productdisposalDao.existsById(id)) productdisposalDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this productdisposal already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Productdisposal productdisposal, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new productdisposal", UsecaseList.ADD_PRODUCTDISPOSAL);

        productdisposal.setTocreation(LocalDateTime.now());
        productdisposal.setCreator(authUser);
        productdisposal.setId(null);

        for(Productdisposalproduct productdisposalproduct : productdisposal.getProductdisposalproductList()) productdisposalproduct.setProductdisposal(productdisposal);

        EntityValidator.validate(productdisposal);

        PersistHelper.save(()->{
            productdisposal.setCode(codeGenerator.getNextId(codeConfig));
            return productdisposalDao.save(productdisposal);
        });

        return new ResourceLink(productdisposal.getId(), "/productdisposals/"+productdisposal.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Productdisposal productdisposal, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update productdisposal details", UsecaseList.UPDATE_PRODUCTDISPOSAL);

        Optional<Productdisposal> optionalProductdisposal = productdisposalDao.findById(id);
        if(optionalProductdisposal.isEmpty()) throw new ObjectNotFoundException("Productdisposal not found");
        Productdisposal oldProductdisposal = optionalProductdisposal.get();

        productdisposal.setId(id);
        productdisposal.setCode(oldProductdisposal.getCode());
        productdisposal.setCreator(oldProductdisposal.getCreator());
        productdisposal.setTocreation(oldProductdisposal.getTocreation());

        for(Productdisposalproduct productdisposalproduct : productdisposal.getProductdisposalproductList()) productdisposalproduct.setProductdisposal(productdisposal);

        EntityValidator.validate(productdisposal);

        productdisposal = productdisposalDao.save(productdisposal);
        return new ResourceLink(productdisposal.getId(), "/productdisposals/"+productdisposal.getId());
    }

}